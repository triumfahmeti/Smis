using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smis.Models
{
    public class AfatiProvimit
    {

        public int AfatiProvimitId { get; set; }

        public string Emri { get; set; }  // p.sh. "Afati Janar 2025"
        public DateTime DataFillimit { get; set; }
        public DateTime DataMbarimit { get; set; }

        public int DepartamentiId { get; set; }
        public Departamenti Departamenti { get; set; }

        public bool Aktiv { get; set; } = true;

    }
}