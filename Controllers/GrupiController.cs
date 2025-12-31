using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Smis.Models;
using Smis.Mappers.GrupiMappers;
using Smis.Mappers;
using Smis.Dtos.GrupiDto;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;


namespace Smis.Controllers
{

    [ApiController]
    [Route("api/grupi")]
    public class GrupiController : ControllerBase
    {
        private readonly SmisContext _context;
        private readonly GrupiMapper _mapper;
        private readonly IMapper _imapper;

        public GrupiController(SmisContext context, GrupiMapper mapper, IMapper imapper)
        {
            _context = context;
            _mapper = mapper;
            _imapper = imapper;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<IActionResult> ShtoGrupi([FromBody] CreateGrupiDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var grupi = _imapper.Map<Grupi>(dto);
            _context.Grupi.Add(grupi);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ShtoGrupi), new { id = grupi.GrupiId }, new
            {
                message = "Grupi u shtua me sukses",
                grupiId = grupi.GrupiId
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Student,StafAkademik,SuperAdmin")]

        public async Task<ActionResult<ReadGrupiDto>> GetGrupiById(int id)
        {
            var grupi = await _context.Grupi
                .Include(g => g.Semestri)
                .Include(g => g.Departamenti)
                .FirstOrDefaultAsync(g => g.GrupiId == id);

            if (grupi == null)
                return NotFound();

            return _mapper.ToReadDto(grupi);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,StafAkademik,SuperAdmin")]


        public async Task<ActionResult<IEnumerable<ReadGrupiDto>>> GetAllGrupet()
        {
            var grupet = await _context.Grupi
                .Include(g => g.Semestri)
                .Include(g => g.Departamenti)
                .ToListAsync();

            var grupetDto = grupet.Select(g => _mapper.ToReadDto(g)).ToList();

            return Ok(grupetDto);
        }

        [HttpGet("departamenti/{departamentiId}")]
        [Authorize(Roles = "Admin,Student,StafAkademik,SuperAdmin")]

        public async Task<ActionResult<IEnumerable<ReadGrupiDto>>> GetAllGrupetByDepartamenti(int departamentiId)
        {
            var grupet = await _context.Grupi
                .Include(g => g.Semestri)
                .Include(g => g.Departamenti)
                .Where(g => g.DepartamentiId == departamentiId)
                .ToListAsync();

            var grupetDto = grupet.Select(g => _mapper.ToReadDto(g)).ToList();

            return Ok(grupetDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<IActionResult> UpdateGrupi(int id, [FromBody] EditGrupiDto dto)

        {
            var grupi = await _context.Grupi.FindAsync(id);
            if (grupi == null) return NotFound();

            _imapper.Map(dto, grupi);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Grupi u update me sukses" });

        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<IActionResult> DeleteGrupi(int id)
        {
            var grupi = await _context.Grupi.FindAsync(id);
            if (grupi == null) return NotFound();
            _context.Grupi.Remove(grupi);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Grupi u fshiu me sukses" });
        }

        [HttpPut("resetogrupet/{departamentiId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]

        public async Task<IActionResult> ResetoGrupetStudenteve(int departamentiId)
        {
            var studentet = await _context.Studenti
       .Where(s => s.GrupiId != null && s.DepartamentiId == departamentiId)
       .ToListAsync();

            foreach (var studenti in studentet)
            {
                studenti.GrupiId = null;
            }

            await _context.SaveChangesAsync();
            return Ok("Grupet e studenteve u resetuan me sukses.");
        }

        [HttpGet("grupet-me-vende-lira/{departamentiId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetGrupetMeVendeLira(int departamentiId)
        {
            var grupet = await _context.Grupi
                .Include(g => g.Studenti)
                 .Where(g => g.DepartamentiId == departamentiId)
                .Select(g => new
                {
                    g.GrupiId,
                    g.Emri,
                    g.Kapaciteti,
                    StudentetNeGrup = g.Studenti.Count,
                    VendetELira = g.Kapaciteti.HasValue ? g.Kapaciteti.Value - g.Studenti.Count : 0
                })
                .ToListAsync();

            return Ok(grupet);
        }

        [HttpGet("studenti-grupi/{studentiId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetGrupiAktual(int studentiId)
        {
            var studenti = await _context.Studenti
                .Include(s => s.Grupi)
                .FirstOrDefaultAsync(s => s.StudentiId == studentiId);

            if (studenti == null)
                return NotFound("Studenti nuk u gjet.");

            if (studenti.Grupi == null)
                return Ok(new { kaGrup = false });

            return Ok(new
            {
                kaGrup = true,
                grupiId = studenti.Grupi.GrupiId,
                emriGrupit = studenti.Grupi.Emri
            });
        }

    }

}