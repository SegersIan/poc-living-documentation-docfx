using MyDataContractsExample.Types;

namespace MyDataContractsExample.DataContracts
{
    /// <summary>
    /// Some HumanActor summary
    /// </summary>
    public class HumanActor : Actor
    {
        /// <summary>
        /// Some FirstName summary
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary>
        /// Some LastName summary
        /// </summary>
        [Obsolete]
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// Just a shitty name
        /// </summary>
        [Obsolete("A between name is a shitty naming")]
        public string BetweenName {  get; set; } = string.Empty;
        /// <summary>
        /// Some PhysicalLocation summary
        /// </summary>
        public PhysicalLocation PhysicalLocation { get; set; }

        public HumanActor() : base() {
            ActorType = "Human Actor";
            PhysicalLocation = new PhysicalLocation();
        }

        public string someMethod()
        {
            return "Hello world";
        }
    }
}
