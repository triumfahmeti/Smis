using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smis.Dtos.PuntoriDto
{
    public class CreateRobotiDto
    {

        public string Emri { get; set; }
        public string Modeli { get; set; }
        public int VitiProdhimit { get; set; }

        public int FabrikaId { get; set; }

    }
}