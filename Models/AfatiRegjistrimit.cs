using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Smis.Models
{
    public class AfatiRegjistrimit
    {
        public int Id { get; set; }
        public int FakultetiId { get; set; }
        public DateTime DataFillimit { get; set; }
        public DateTime DataMbarimit { get; set; }
        public string TipiSemestrit { get; set; } // "Tek" ose "Cift"
        public string Pershkrimi { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public Universiteti Universiteti { get; set; }
    }
}