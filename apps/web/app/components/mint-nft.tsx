"use client";
import * as React from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const abi = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    outputs: [],
  },
] as const;

export function MintNFT() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("tokenId") as string;
    writeContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi,
      functionName: "mint",
      args: [BigInt(tokenId)],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <form onSubmit={submit}>
      <input name="tokenId" placeholder="69420" required />
      <button disabled={isPending} type="submit">
        {isPending ? "Confirming..." : "Mint"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
}
