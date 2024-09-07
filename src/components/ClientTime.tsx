"use client";

import { useEffect, useState } from "react";

type ClientTimeProps = {
  serverDate: string;
  serverFormatted: string;
};

export default function ClientTime({
  serverDate,
  serverFormatted, //date from server to show in the client before this component updates with client-side date
}: ClientTimeProps) {
  const [clientTime, setClientTime] = useState<string>(serverFormatted);

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(serverDate));

    setClientTime(formattedDate);
  }, [serverDate]);

  return <span>{clientTime}</span>;
}
