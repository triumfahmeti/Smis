using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smis.Models;
using Smis.Dtos.AfatiSemestritDtos;

namespace Smis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AfatiRegjistrimitController : ControllerBase
    {
        private readonly SmisContext _context;

        public AfatiRegjistrimitController(SmisContext context)
        {
            _context = context;
        }


        [HttpPost("krijo-afat")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> KrijoAfat([FromBody] AfatiSemestritDto dto)
        {
            var afati = new AfatiRegjistrimit
            {
                FakultetiId = dto.FakultetiId,
                DataFillimit = dto.DataFillimit,
                DataMbarimit = dto.DataMbarimit,
                TipiSemestrit = dto.TipiSemestrit,
                Pershkrimi = dto.Pershkrimi,
                CreatedAt = DateTime.UtcNow
            };

            _context.AfatiRegjistrimit.Add(afati);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Afati u krijua me sukses." });
        }

        [HttpGet("afat-aktiv/{fakultetiId}")]
        [Authorize(Roles = "Admin,Student")]

        public async Task<IActionResult> MerrAfatinAktiv(int fakultetiId)
        {
            var afati = await _context.AfatiRegjistrimit.Where(a => a.FakultetiId == fakultetiId &&
            a.DataFillimit <= DateTime.UtcNow &&
            a.DataMbarimit >= DateTime.UtcNow)
            .OrderByDescending(a => a.DataFillimit).FirstOrDefaultAsync();

            if (afati == null)
            {
                return NotFound("Nuk ka afat regjistrimi aktiv.");
            }
            return Ok(afati);
        }
        [HttpPut("{afatiId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditoAfatin(int afatiId, [FromBody] AfatiSemestritDto dto)
        {
            var ekzistues = await _context.AfatiRegjistrimit.FindAsync(afatiId);
            if (ekzistues == null)
                return NotFound("Afati nuk u gjet.");

            ekzistues.FakultetiId = dto.FakultetiId;
            ekzistues.DataFillimit = dto.DataFillimit;
            ekzistues.DataMbarimit = dto.DataMbarimit;
            ekzistues.TipiSemestrit = dto.TipiSemestrit;
            ekzistues.Pershkrimi = dto.Pershkrimi;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Afati u përditësua me sukses." });
        }


    }
}