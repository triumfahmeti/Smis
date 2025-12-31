using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smis.Dtos.Studenti;
using Smis.Mappers;
using Smis.Mappers.TranskriptaNotaveMapper;
using Smis.Models;
using AutoMapper;
using Smis.Dtos.RegjistrimiSemestrit;
using Smis.Dtos.GrupiDto;
using Microsoft.AspNetCore.Authorization;


namespace Smis.Controllers
{
    [Authorize]
    [Route("api/studenti")]
    [ApiController]
    public class StudentiController : ControllerBase
    {
        private readonly SmisContext _context;
        private readonly TranskriptaNotaveMapper _notaMapper;
        private readonly IMapper _mapper;
        public StudentiController(SmisContext smisContext, IMapper mapper)
        {
            _context = smisContext;
            _notaMapper = new TranskriptaNotaveMapper();
            _mapper = mapper;

        }
        [HttpGet]
        public IActionResult GetAll()
        {
            var studentet = _context.Studenti.ToList();
            return Ok(studentet);
        }
        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var studenti = _context.Studenti.Find(id);
            if (studenti == null)
            {
                return NotFound();
            }
            return Ok(studenti);
        }
        [HttpPost]
        public IActionResult Create([FromBody] StudentiDto studentiDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var studentModel = studentiDto.ToStudentiFromCreateDTO();
            _context.Studenti.Add(studentModel);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = studentModel.StudentiId }, new
            {
                message = "Studenti u shtua me sukses",
                studentiId = studentModel.StudentiId
            });
        }
        [HttpPost("regjistrosemestrin")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> RegjistroSemestrin([FromBody] CreateRegjistrimiSemestritDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Kontrollo nëse ekziston një afat regjistrimi aktiv për fakultetin e studentit
            var afati = await _context.AfatiRegjistrimit
                .Where(a => a.FakultetiId == dto.FakultetiId &&
                            a.DataFillimit <= DateTime.UtcNow &&
                            a.DataMbarimit >= DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (afati == null)
                return BadRequest("Nuk ka asnjë afat aktiv për regjistrim semestri.");

            // Kontrollo nëse semestri përputhet me tipin e afatit (Tek ose Cift)
            var semestratLejuar = afati.TipiSemestrit == "Tek"
                ? new[] { 1, 3, 5 }
                : new[] { 2, 4, 6 };

            if (!semestratLejuar.Contains(dto.SemestriId))
                return BadRequest($"Ky semestër ({dto.SemestriId}) nuk lejohet gjatë këtij afati.");

            // Kontrollo nëse studenti e ka regjistruar këtë semestër në të njëjtin afat
            var ekziston = await _context.RegjistrimiSemestrit
                .AnyAsync(r => r.StudentiId == dto.StudentiId &&
                               r.SemestriId == dto.SemestriId &&
                               r.DataRegjistrimit >= afati.DataFillimit &&
                               r.DataRegjistrimit <= afati.DataMbarimit);

            if (ekziston)
                return BadRequest("Ju e keni regjistruar këtë semestër në këtë afat.");

            // Krijo regjistrimin
            var regjistrimiSemestrit = _mapper.Map<RegjistrimiSemestrit>(dto);
            _context.RegjistrimiSemestrit.Add(regjistrimiSemestrit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(RegjistroSemestrin), new { id = regjistrimiSemestrit.RegjistrimiSemestritId }, new
            {
                message = "Regjistrimi i semestrit u krye me sukses",
                regjistrimiId = regjistrimiSemestrit.RegjistrimiSemestritId
            });
        }


        [HttpDelete("cregjistrosemestrin/{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> DeleteRegjistrimiSemestrit(int id)
        {
            var regjistrimiSemestrit = await _context.RegjistrimiSemestrit.FindAsync(id);
            if (regjistrimiSemestrit == null)
            {
                return NotFound();
            }
            _context.RegjistrimiSemestrit.Remove(regjistrimiSemestrit);
            await _context.SaveChangesAsync();
            return Ok(new { message = " Semestri u c'regjistrua me sukses." });
        }

        [HttpGet("{studentId}/regjistrimi-semestrit")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetRegjistrimiSemestritPerStudent(int studentId)
        {
            var regjistrimi = await _context.RegjistrimiSemestrit
                .Include(r => r.Semestri)
                .Where(r => r.StudentiId == studentId)
                .OrderByDescending(r => r.DataRegjistrimit)
                .ToListAsync();

            if (regjistrimi == null || !regjistrimi.Any())
                return NotFound();


            var result = regjistrimi.Select(r => new
            {
                r.RegjistrimiSemestritId,
                r.StudentiId,
                r.Studenti,
                r.SemestriId,
                Semestri = r.Semestri?.Semestri1,
                r.DataRegjistrimit,
                r.Lokacioni,
                r.Nderrimi
            });

            return Ok(result);
        }

        [HttpGet("transkripta/{studentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GjeneroTranskripten(int studentId)
        {
            var notat = await _context.Nota
             .Include(n => n.ParaqitjaEprovimit)
                 .ThenInclude(p => p.Lenda)
             .Where(n => n.StudentiId == studentId && !n.EshteRefuzuar)
             .ToListAsync();

            if (notat == null || !notat.Any())
            {
                return NotFound("Nuk u gjet asnjë notë për këtë student.");
            }

            var notatDto = _notaMapper.MapToDto(notat);
            return Ok(notatDto);


        }
        [HttpPut("zgjedhgrupin")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> ZgjedhGrupin([FromBody] ZgjedhGrupinDto dto)
        {
            var studenti = await _context.Studenti.FindAsync(dto.StudentiId);
            if (studenti == null)
                return NotFound("Studenti nuk u gjet.");

            var grupi = await _context.Grupi
                .Include(g => g.Studenti)  // Marrim edhe studentët që janë regjistruar
                .FirstOrDefaultAsync(g => g.GrupiId == dto.GrupiId);

            if (grupi == null)
                return NotFound("Grupi nuk u gjet.");

            // Kontrollojmë kapacitetin
            var studentetNeGrup = grupi.Studenti.Count;
            if (grupi.Kapaciteti.HasValue && studentetNeGrup >= grupi.Kapaciteti.Value)
            {
                return BadRequest(new { message = "Ky grup është plot, nuk mund të regjistroheni." });
            }

            // Kontrollojmë nëse studenti është tashmë në një grup tjetër
            // if (studenti.GrupiId.HasValue && studenti.GrupiId == dto.GrupiId)
            // {
            //     return BadRequest(new { message = "Ju tashmë jeni regjistruar në këtë grup." });
            // }

            // Ndryshojmë grupin e studentit
            studenti.GrupiId = dto.GrupiId;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Grupi u ruajt me sukses." });
        }
    }
}