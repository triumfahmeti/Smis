using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smis.Dtos.Lenda;
using Smis.Mappers.LendaMappers;
using Smis.Models;

namespace Smis.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    public class LendaController : ControllerBase
    {
        private readonly SmisContext _context;

        public LendaController(SmisContext context)
        {
            _context = context;
        }



        [HttpGet]
        [Authorize(Roles = "Admin,Student,StafAkademik,SuperAdmin")]

        public async Task<ActionResult<IEnumerable<LendaDto>>> GetLendet()
        {
            var lendet = await _context.Lenda
                .Include(l => l.Departamenti)
                .Include(l => l.Semestri)
                .ToListAsync();

            return Ok(lendet.Select(l => new LendaDto
            {
                LendaId = l.LendaId,
                Emri = l.Emri,
                Kredite = l.Kredite,
                DepartamentiId = l.DepartamentiId,
                DepartamentiEmri = l.Departamenti != null ? l.Departamenti.Emri : null,
                SemestriId = l.SemestriId,
                Semestri1 = l.Semestri != null ? l.Semestri.Semestri1 : null,
                Kategoria = l.Kategoria,
            }));
        }


        [HttpGet("departamenti/{departamentiId}")]
        [Authorize(Roles = "Admin,Student,StafAkademik,SuperAdmin")]

        public async Task<ActionResult<IEnumerable<LendaDto>>> GetLendetByDepartamenti(int departamentiId)
        {
            var lendet = await _context.Lenda
                .Include(l => l.Departamenti)
                .Include(l => l.Semestri)
                .Where(l => l.DepartamentiId == departamentiId)
                .ToListAsync();

            var result = lendet.Select(l => new LendaDto
            {
                LendaId = l.LendaId,
                Emri = l.Emri,
                Kredite = l.Kredite,
                DepartamentiId = l.DepartamentiId,
                DepartamentiEmri = l.Departamenti?.Emri,
                SemestriId = l.SemestriId,
                Semestri1 = l.Semestri?.Semestri1,
                Kategoria = l.Kategoria
            }).ToList();

            return Ok(result);
        }





        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Student,StafAkademik,SuperAdmin")]

        public async Task<ActionResult<LendaDto>> GetLenda(int id)
        {
            var lenda = await _context.Lenda.FindAsync(id);
            if (lenda == null)
                return NotFound();

            return Ok(lenda.ToLendaDto());
        }

        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<ActionResult<LendaDto>> CreateLenda(CreateLendaDto dto)
        {
            var lenda = dto.ToLenda();
            _context.Lenda.Add(lenda);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLenda), new { id = lenda.LendaId }, lenda.ToLendaDto());
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<IActionResult> UpdateLenda(int id, CreateLendaDto dto)
        {
            var lenda = await _context.Lenda.FindAsync(id);
            if (lenda == null)
                return NotFound();

            lenda.Emri = dto.Emri;
            lenda.Kredite = dto.Kredite;
            lenda.DepartamentiId = dto.DepartamentiId;
            lenda.SemestriId = dto.SemestriId;
            lenda.Kategoria = dto.Kategoria;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<IActionResult> DeleteLenda(int id)
        {
            var lenda = await _context.Lenda.FindAsync(id);
            if (lenda == null)
                return NotFound();

            _context.Lenda.Remove(lenda);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
