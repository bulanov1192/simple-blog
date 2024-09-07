"use client";

import { Button } from "@/components";
import Link from "next/link";
import React from "react";

const ErrorPage: React.FC = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => any;
}) => {
  return (
    <div>
      <h1>Server Error</h1>
      <p>Sorry, something went wrong on the server.</p>
      <p>Please try again later.</p>
      {error?.message && <p>{error.message}</p>}
      <br />
      <Button onClick={reset}>Retry</Button>
      <Link href="/">
        <Button>Return to main page</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
