declare module 'nodemailer' {
  interface Transport {
    sendMail(options: { from: string; to: string; subject: string; html: string }): Promise<unknown>;
  }
  function createTransport(options: unknown): Transport;
  const defaultExport: { createTransport: typeof createTransport };
  export default defaultExport;
}
