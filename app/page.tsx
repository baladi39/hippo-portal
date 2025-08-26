import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Hippo Portal</h1>
        <p className="text-gray-600 mb-6">
          Navigate to the different sections of the Hippo portal
        </p>
        <div className="space-x-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
