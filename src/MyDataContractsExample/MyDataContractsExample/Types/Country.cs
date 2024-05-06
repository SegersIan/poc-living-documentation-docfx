namespace MyDataContractsExample.Types
{
    /// <summary>
    /// Country of the system
    /// </summary>
    public class Country
    {
        /// <summary>
        /// Just a name
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Just because I wanted an enum
        /// </summary>
        public Continent Continent { get; set; }
        /// <summary>
        /// Country Code
        /// </summary>
        [Obsolete("Stop using it")]
        public string CountryCode { get; set; }
    }
}
