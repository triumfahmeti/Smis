using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smis.Dtos.AfatiProvimitDtos;
using Smis.Models;

namespace Smis.Controllers
{
    [ApiController]
    [Route("api/afatiprovimit")]
    public class AfatiProvimitController : ControllerBase
    {
        private readonly SmisContext _context;

        public AfatiProvimitController(SmisContext context)
        {
            _context = context;
        }

        [HttpGet("aktiv/{departamentiId}")]
        [Authorize(Roles = "Student,Admin")]
        public async Task<IActionResult> GetAfatiAktiv(int departamentiId)
        {
            var afati = await _context.AfatiProvimit
                .FirstOrDefaultAsync(a => a.DepartamentiId == departamentiId && a.Aktiv);

            if (afati == null)
                return NotFound("Nuk ka afat të hapur për këtë departament.");

            if (DateTime.Now > afati.DataMbarimit)
            {
                afati.Aktiv = false;
                await _context.SaveChangesAsync();
                return NotFound("Ky afat ka skaduar, nuk ka afat aktiv per momentin");
            }

            return Ok(new
            {
                afati.AfatiProvimitId,
                afati.Emri,
                afati.DataFillimit,
                afati.DataMbarimit,
                afati.Aktiv
            });
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAfati([FromBody] AfatiProvimitDto dto)
        {
            var afati = new AfatiProvimit
            {
                Emri = dto.Emri,
                DataFillimit = dto.DataFillimit,
                DataMbarimit = dto.DataMbarimit,
                Aktiv = dto.Aktiv,
                DepartamentiId = dto.DepartamentiId

            };

            _context.AfatiProvimit.Add(afati);
            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAfati(int id, [FromBody] AfatiProvimitDto dto)
        {
            var existingAfati = await _context.AfatiProvimit.FindAsync(id);
            if (existingAfati == null) return NotFound();

            existingAfati.Emri = dto.Emri;
            existingAfati.DataFillimit = dto.DataFillimit;
            existingAfati.DataMbarimit = dto.DataMbarimit;
            existingAfati.Aktiv = dto.Aktiv;

            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAfati(int id)
        {
            var afati = await _context.AfatiProvimit.FindAsync(id);
            if (afati == null) return NotFound();

            _context.AfatiProvimit.Remove(afati);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}