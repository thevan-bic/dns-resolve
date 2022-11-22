export type DNSConfig = {
  hostname: string;
  nameserver: string;
};

export type ExecOptions = {
  name?: string;
  icns?: string;
  env?: { [key: string]: string };
};
