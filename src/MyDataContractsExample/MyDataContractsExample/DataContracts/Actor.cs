namespace MyDataContractsExample.DataContracts
{
    /// <summary>
    /// Summary on class level
    /// </summary>
    public class Actor : GenericEntity
    {
        /// <summary>
        /// Some Actor ID summary
        /// </summary>
        public Guid ActorId { get; set; }
        /// <summary>
        /// Some Actor Type summary
        /// </summary>
        public string ActorType { get; set; } = "Generic Actor";

        /// <summary>
        /// Some constructor summary
        /// </summary>
        public Actor() { 
            ActorId = Guid.NewGuid();
        }
    }
}
