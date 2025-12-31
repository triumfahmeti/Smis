using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smis.Models
{
    public class Roboti
    {
        public int RobotiId { get; set; }

        public string Emri { get; set; }
        public string Modeli { get; set; }
        public int VitiProdhimit { get; set; }

        public int FabrikaId { get; set; }


        public Fabrika Fabrika { get; set; }



    }
}