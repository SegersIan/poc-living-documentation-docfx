namespace MyDataContractsExample.DataContracts
{
    /// <summary>
    /// we like inheritance
    /// </summary>
    public class GenericEntity
    {
        /// <summary>
        /// Just for more nesting
        /// </summary>
        public string GenericID { get; set; }
        /// <summary>
        /// Just need deprecated fields
        /// </summary>
        [Obsolete("You are done fore")]
        public string GenericName { get; set; }
    }
}
