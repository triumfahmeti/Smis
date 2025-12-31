using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Smis.Models;

namespace Smis.Controllers
{
    //     public class Mbrojtja
    //     {
    //         public int LecturerId { get; set; }
    //         public string LecturerName { get; set; }
    //         public string Departament { get; set}
    //         public string Email { get; set}
    //         public ICollection<Ligerata> Ligjeratat { get; set; }


    //         public int LectureId { get; set; }
    //         public int LectureName { get; set}
    //         public int LecturerID { get; set}
    //         public <Ligjeruesi> Ligjeruesi {get; set;}


    //     modelBuilder.Entity<Ligjeruesi>().HasMany(l=>l.ligjerata).WithOne(l= l.Ligjeruesi).hasForeignKey(l=>l.ligjerataId);



    //     public Ligjeruesi(SmisContext context) {
    //         _context = context;
    //     }
    //     [HttpPost]
    //     public async Task<IActionResult> Create([FromBody] Ligjeruesi ligj) {
    //         if (ligj == null)
    //         {
    //             return BadRequest();

    //         }
    //         _context.Ligjeruesit.Add(ligj);
    //         await _context.SaveChangesAsync();
    //         return Ok(ligjeruesi);
    //     }
    //     [HttpGet]
    //     public async Task<IActionResult> GetLigj() {
    //         var ligjeruesit = await _context.Ligjeruesit.ToListAsync();
    //         return Ok(ligjeruesit);
    //     }
    // [HttpGet]
    // public async Task<IActionResult> GetLigjeruesiById(int id)
    // {
    //     var ligjeruesi = await _context.Ligjeruesi.FindAsync(id);
    //     if (ligjeruesi == null)
    //     {
    //         return NotFound();
    //     }
    //     return Ok(ligjeruesi);

    // }
    //     }
}