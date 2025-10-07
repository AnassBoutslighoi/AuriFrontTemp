"use client";

import { useStores } from "@/hooks/stores";
import { useTenant } from "@/components/tenant-provider";

export default function DebugStores() {
  const tenant = useTenant();
  const storesQuery = useStores();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Debug Stores</h2>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Tenant Context:</h3>
        <pre>{JSON.stringify(tenant, null, 2)}</pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Stores Query:</h3>
        <p><strong>Loading:</strong> {storesQuery.isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {storesQuery.error ? String(storesQuery.error) : 'None'}</p>
        <p><strong>Data:</strong></p>
        <pre>{JSON.stringify(storesQuery.data, null, 2)}</pre>
      </div>
      
      <div className="bg-blue-100 p-4 rounded">
        <h3 className="font-semibold">Manual Test:</h3>
        <button 
          onClick={async () => {
            try {
              const res = await fetch('/api/n8n/stores/list?platform=all&status=all&limit=10');
              const data = await res.json();
              console.log('Manual fetch result:', { 
                status: res.status, 
                ok: res.ok, 
                data 
              });
            } catch (error) {
              console.error('Manual fetch error:', error);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Manual Fetch
        </button>
      </div>
    </div>
  );
}