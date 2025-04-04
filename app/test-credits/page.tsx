"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function TestCreditsPage() {
  const [result, setResult] = useState<any>(null);
  const testAddTransaction = useMutation(api.credits.testAddTransaction);

  const handleTest = async () => {
    try {
      const response = await testAddTransaction();
      setResult(response);
      console.log("Test response:", response);
    } catch (error) {
      console.error("Test failed:", error);
      setResult({ error: String(error) });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Credits System</h1>
      <Button onClick={handleTest}>Test Add Transaction</Button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
