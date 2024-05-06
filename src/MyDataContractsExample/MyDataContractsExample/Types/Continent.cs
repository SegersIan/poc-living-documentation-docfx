namespace MyDataContractsExample.Types
{
    /// <summary>
    /// Contintent that we support
    /// </summary>
    public enum Continent
    {
        /// <summary>
        /// Geographical EU
        /// </summary>
        Europe,
        /// <summary>
        /// Geographical Asia
        /// </summary>
        Asia,
        [Obsolete("We don't serve that anymore.")]
        America
    }
}
