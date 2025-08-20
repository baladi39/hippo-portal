"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function TestDbPage() {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      // Test basic connection
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public");

      if (tablesError) {
        console.error("Tables query error:", tablesError);
        setError(`Tables error: ${tablesError.message}`);
      } else {
        console.log("Available tables:", tablesData);
      }

      // Test plans table
      const { data: plansData, error: plansError } = await supabase
        .from("plans")
        .select("*")
        .limit(5);

      if (plansError) {
        console.error("Plans query error:", plansError);
        setError(`Plans error: ${plansError.message}`);
      } else {
        console.log("Plans data:", plansData);
        setResults(plansData || []);
      }
    } catch (err) {
      console.error("Test error:", err);
      setError(`Test error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Testing database connection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Plans Data ({results.length} records):
        </h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
}
