'use client';

import { PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import {
  useVestingProgram,
  useVestingProgramAccount,
} from './vesting-data-access';
import { useWallet } from '@solana/wallet-adapter-react';

export function VestingCreate() {
  const { createVestingAccount } = useVestingProgram();
  const [company, setCompany] = useState('');
  const [mint, setMint] = useState('');
  const { publicKey } = useWallet();

  const isFormValid = company.length > 0 && mint.length > 0;

  const handleSubmit = () => {
    if(publicKey && isFormValid) {
        createVestingAccount.mutateAsync({companyName: company, mint: mint});
    }
  };

  if(!publicKey) {
    return <p> Connect your wallet</p>
  }

  return (
    <div>
        <input 
            type="text" 
            placeholder="Company Name"
            value = {company}
            onChange={(e) => setCompany(e.target.value)} 
            className='input input-bordered w-full max-w-xs mr-2'
        />
        <input 
            type="text" 
            placeholder="Mint Address"
            value = {mint}
            onChange={(e) => setMint(e.target.value)} 
            className='input input-bordered w-full max-w-xs'
        />


        <button
            className="btn btn-xs lg:btn-md btn_major mt-10"
            onClick={handleSubmit}
            disabled={createVestingAccount.isPending || !isFormValid}
            >
            Create New Vesting Account
        </button>
    </div>

  ); 
}

export function VestingList() {
    const { accounts, getProgramAccount } = useVestingProgram();
  
    if (getProgramAccount.isLoading) {
      return <span className="loading loading-spinner loading-lg"></span>;
    }
    if (!getProgramAccount.data?.value) {
      return (
        <div className="alert alert-info flex justify-center">
          <span>
            Program account not found. Make sure you have deployed the program and
            are on the correct cluster.
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center mt-6">
        {accounts.isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : accounts.data?.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
            {accounts.data?.map((account) => (
              <VestingCard
                key={account.publicKey.toString()}
                account={account.publicKey}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-semibold">No accounts</h2>
            <p>No accounts found. Create one above to get started.</p>
          </div>
        )}
      </div>
    );
  }

function VestingCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    createEmployeeVesting
  } = useVestingProgramAccount({ account });

  
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cliffTime, setCliffTime] = useState(0);
  const [beneficiary, setBeneficiary] = useState('');
  
  const companyName = useMemo(
    () => accountQuery.data?.companyName ?? 0,
    [accountQuery.data?.companyName]
  )

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-1 text-neutral-content p-4 rounded-lg shadow-md">
      <div className="card-body space-y-3">
        <h2
          className="text-lg font-medium text-center text-gray-700 cursor-pointer"
          onClick={() => accountQuery.refetch()}
        >
          {companyName}
        </h2>
        <div className="space-y-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-500 text-sm">Start Time</span>
            </label>
            <input
              type="number"
              placeholder="Start time"
              value={startTime || ''}
              onChange={(e) => setStartTime(parseInt(e.target.value) || 0)}
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-500 text-sm">End Time</span>
            </label>
            <input
              type="number"
              placeholder="End time"
              value={endTime || ''}
              onChange={(e) => setEndTime(parseInt(e.target.value) || 0)}
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-500 text-sm">Total Amount</span>
            </label>
            <input
              type="number"
              placeholder="Total amount"
              value={totalAmount || ''}
              onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-500 text-sm">Cliff Time</span>
            </label>
            <input
              type="number"
              placeholder="Cliff time"
              value={cliffTime || ''}
              onChange={(e) => setCliffTime(parseInt(e.target.value) || 0)}
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-500 text-sm">Beneficiary Wallet Address</span>
            </label>
            <input
              type="text"
              placeholder="Wallet address"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>
        <div className="card-actions justify-center mt-3">
          <button
            className="btn btn-sm bg-white border border-black text-black hover:text-white hover:bg-black"
            onClick={() =>
              createEmployeeVesting.mutateAsync({
                startTime,
                endTime,
                totalAmount,
                cliff: cliffTime,
                beneficiary,
              })
            }
            disabled={createEmployeeVesting.isPending}
          >
            {createEmployeeVesting.isPending ? '...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}


