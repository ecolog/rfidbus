using System;

using RfidBus.Com;

namespace ComAsClassExample
{
    internal class Program
    {
        private RfidBusComClient _client = null;

        private static void Main(string[] args)
        {
            var program = new Program();

            try
            {
                program.DoWork();
            }
            catch(Exception ex)
            {
                Console.WriteLine("Caught exception {0}: '{1}'.", ex.GetType(), ex.Message);
            }
            finally
            {
                program.Finish();

                WaitForKey("Press ENTER to exit.", ConsoleKey.Enter);
            }
        }

        private void DoWork()
        {
            Console.WriteLine("Establishing connection to RFID Bus...");
            this._client = new RfidBusComClient();
            if(!this._client.Connect("127.0.0.1", 20000, "admin", "admin"))
                throw new Exception("Can't establishe connection to RFID Bus.");
            Console.WriteLine("Connection established.");

            this._client.TransponderFound += this.ComClientOnTransponderFound;

            Console.WriteLine("Subscribing to readers...");
            var readers = this._client.GetReaders();
            foreach(var reader in readers)
            {
                this._client.SubscribeToReader(reader.Id);
                this._client.StartReading(reader.Id);
            }

            WaitForKey("Press ESC to stop.", ConsoleKey.Escape);
        }

        private void ComClientOnTransponderFound(string reader, string tid)
        {
            Console.WriteLine("> Reader '{0}' found transponder '{1}'.", reader, tid);
        }

        private void Finish()
        {
            if(this._client == null)
                return;

            this._client.Close();
        }

        private static void WaitForKey(string message, ConsoleKey key)
        {
            Console.WriteLine();
            Console.WriteLine(message);
            while(Console.ReadKey(true)
                         .Key != key)
            {
            }
        }
    }
}
