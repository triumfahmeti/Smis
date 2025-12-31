using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smis.Dtos.AfatiSemestritDtos
{
    public class AfatiSemestritDto
    {
        public int FakultetiId { get; set; }
        public DateTime DataFillimit { get; set; }
        public DateTime DataMbarimit { get; set; }
        public string TipiSemestrit { get; set; }
        public string Pershkrimi { get; set; }
    }
}