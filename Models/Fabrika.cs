using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smis.Models
{
    public class Fabrika
    {
        public int FabrikaId { get; set; }
        public string Emri { get; set; }
        public string Lokacioni { get; set; }
        public string Shteti { get; set; }




        public ICollection<Roboti> Roboti { get; set; }

    }
}