namespace MyDataContractsExample.DataContracts
{
    /// <summary>
    /// This one was fun
    /// </summary>
    [Obsolete("Deprecated in favour of HumanActor")]
    public class DeprecatedHumanActor : Actor
    {
        /// <summary> 
        /// Some Comments A
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary> 
        /// Some Comments B
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// Some Comments C
        /// </summary>
        public string PhysicalLocation { get; set; } = string.Empty;

        /// <summary>
        /// General Constructor
        /// </summary>
        public DeprecatedHumanActor() : base()
        {
            ActorType = "Human Actor";
        }
    }
}
