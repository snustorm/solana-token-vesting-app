# Solana Token-Vesting Swap (Full Code: Frontend, backend, smart contract)

<div align="center">
  <p style="color: red; font-size: 20px; font-weight: bold;">
    Feel free to use, deploy, and improve this project
  </p>
</div>

- smart contract(devnet): GPCNSb6BAefBhaEhUVEbuVDeHyxcjuFq1KZofv6Mjcba
- Functions support:
  - Create Multiple Vesting Account for Employee
  - Create Multiple Employee Account
  - Claim Tokens
  
<img width="833" alt="截屏2024-12-05 21 22 11" src="https://github.com/user-attachments/assets/3d56608a-503a-4aa0-9010-9d8e410ce0ff">


## Getting Started

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```
