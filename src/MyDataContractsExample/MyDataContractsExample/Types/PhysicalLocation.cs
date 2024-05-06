namespace MyDataContractsExample.Types
{
    /// <summary>
    /// A physicla location
    /// </summary>
    public class PhysicalLocation
    {
        /// <summary>
        /// Which country
        /// </summary>
        public Country Country { get; set; }
        /// <summary>
        /// Country code
        /// </summary>
        [Obsolete("Deprecated due to new structure and bad name")]
        public string COuntryCode { get; set; }
        /// <summary>
        /// ...ok
        /// </summary>
        public string City { get; set; } = string.Empty;
        /// <summary>
        /// yaay
        /// </summary>
        public string Street { get; set; } = string.Empty;
    }
}
