using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smis.Dtos.AfatiProvimitDtos
{
    public class AfatiProvimitDto
    {


        public string Emri { get; set; }
        public DateTime DataFillimit { get; set; }
        public DateTime DataMbarimit { get; set; }
        public bool Aktiv { get; set; }
        public int DepartamentiId { get; set; }
    }
}
