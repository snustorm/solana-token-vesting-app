'use client';

// import { getVestingProgram, getVestingProgramId } from '@token-vesting/anchor';
import {useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { BN, Program, Idl } from "@project-serum/anchor";
import IDL from "../utils/idl.json"; 

interface CreateVestingArgs {
    companyName: string,
    mint: string,
}

interface CreateEmployeeArgs {
    startTime: number,
    endTime: number,
    totalAmount: number,
    cliff: number,
    beneficiary: string,
}

export function useVestingProgram() {
  
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = new PublicKey("GPCNSb6BAefBhaEhUVEbuVDeHyxcjuFq1KZofv6Mjcba")
  const program = new Program(IDL as unknown as Idl, programId, provider);

  const accounts = useQuery({
    queryKey: ['vesting', 'all', { cluster }],
    queryFn: () => program.account.vestingAccount.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createVestingAccount = useMutation<string, Error, CreateVestingArgs>({
    mutationKey: ['vestingAccount', 'create', { cluster }],
    mutationFn: async ({ companyName, mint }) => {
      
        // Derive the PDA for vestingAccount
      const[vestingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from(companyName)],
        program.programId
      );

      const [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
        program.programId
      );
  
      // Call the method with the derived vestingAccount PDA
      return program.methods
        .createVestingAccount(companyName)
        .accounts({
          vestingAccount, // Pass the derived PDA
          mint: new PublicKey(mint),
          tokenProgram: TOKEN_PROGRAM_ID,
          treasuryTokenAccount: treasuryTokenAccount,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      console.log('success', signature);
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: (error) => {
      console.error('Error creating vesting account:', error);
      toast.error('Failed to create vesting account');
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createVestingAccount,
  };
}

export function useVestingProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useVestingProgram();
  

  const accountQuery = useQuery({
    queryKey: ['vesting', 'fetch', { cluster, account }],
    queryFn: () => program.account.vestingAccount.fetch(account),
  });

  const createEmployeeVesting = useMutation<string, Error, CreateEmployeeArgs>({
    mutationKey: ['employeeAccount', 'create', { cluster }],
    mutationFn: ({startTime, endTime, cliff, totalAmount, beneficiary}) => {

        console.log("create employee vesting account");

        const [employeeAccount] = PublicKey.findProgramAddressSync(
            [
              Buffer.from("employee_vesting"),
              new PublicKey(beneficiary).toBuffer(), // Convert beneficiary to PublicKey
              account.toBuffer(), // Use account buffer
            ],
            program.programId
          );
        console.log("employee account: ", employeeAccount.toBase58());
      
        return  program.methods
        .createEmployeeVesting(
            new BN(startTime),
            new BN(endTime),
            new BN(cliff),
            new BN(totalAmount),
        )
        .accounts({ 
            beneficiary: new PublicKey(beneficiary),
            vestingAccount: account,
            employeeAccount,
         })
        .rpc()
    },
        onSuccess: (signature) => {
        transactionToast(signature);
        return accounts.refetch();
    },
        onError: () => toast.error('Failed to create vesting account'),
        }); 

  
  return {
    accountQuery,
    createEmployeeVesting,
  };

}
