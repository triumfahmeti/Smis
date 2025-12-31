using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Smis.Dtos.ParaqitjaEProvimitDto;
using Smis.Models;
using Microsoft.EntityFrameworkCore;
using System.Xml;
using Microsoft.AspNetCore.Authorization;

namespace Smis.Controllers
{
    [Authorize]
    [Route("api/paraqitjaeprovimit")]
    [ApiController]

    public class ParaqitjaEProvimitController : ControllerBase
    {
        private readonly SmisContext _context;
        private readonly IMapper _mapper;

        public ParaqitjaEProvimitController(SmisContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetParaqitjaEProvimitDto>>> GetParaqitjaEProvimit()
        {
            var paraqitjaEProvimit = await _context.ParaqitjaEprovimit.ToListAsync();
            var paraqitjaEProvimitDto = _mapper.Map<List<GetParaqitjaEProvimitDto>>(paraqitjaEProvimit);
            return Ok(paraqitjaEProvimitDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetParaqitjaEProvimitDto>> GetParaqitjaEProvimitByID(int id)
        {
            var paraqitjaEProvimit = await _context.ParaqitjaEprovimit.FirstOrDefaultAsync(p => p.ParaqitjaId == id);
            if (paraqitjaEProvimit == null) return NotFound();
            var paraqitjaEProvimitDto = _mapper.Map<GetParaqitjaEProvimitDto>(paraqitjaEProvimit);
            return Ok(paraqitjaEProvimitDto);
        }

        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> CreateParaqitjaEProvimit([FromBody] CreateEditParaqitjaEProvimitDto dto)
        {

            var afatiAktiv = await _context.AfatiProvimit
    .FirstOrDefaultAsync(a => a.DepartamentiId == dto.DepartamentiId && a.Aktiv);
            //   a.DataFillimit <= DateTime.UtcNow && a.DataMbarimit >= DateTime.UtcNow);

            if (afatiAktiv == null)
                return BadRequest("Nuk ka afat të aktiv për paraqitjen e këtij provimi.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var ekziston = await _context.ParaqitjaEprovimit
                .AnyAsync(p => p.StudentiId == dto.StudentiId && p.LendaId == dto.LendaId && p.AfatiProvimitId == afatiAktiv.AfatiProvimitId);

            if (ekziston)
                return BadRequest("Studenti tashmë ka paraqitur këtë provim për këtë afat.");

            var provimi = await _context.Provimi
        .FirstOrDefaultAsync(p => p.LendaId == dto.LendaId && p.StafiAkademikId == dto.StafiId);
            if (provimi == null) return NotFound("Nuk ekziston një provim për këtë lëndë nga ligjëruesi i zgjedhur.");
            var paraqitjaEProvimit = new ParaqitjaEprovimit
            {
                LendaId = dto.LendaId,
                StudentiId = dto.StudentiId,
                StafiAkademikId = dto.StafiId,
                AfatiProvimitId = afatiAktiv.AfatiProvimitId,

            };
            _context.ParaqitjaEprovimit.Add(paraqitjaEProvimit);
            await _context.SaveChangesAsync();


            return CreatedAtAction(nameof(CreateParaqitjaEProvimit), new { id = paraqitjaEProvimit.ParaqitjaId }, new
            {
                message = "Provimi u paraqit me sukses",
                paraqitjaId = paraqitjaEProvimit.ParaqitjaId
            });


        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateParaqitjaEProvimit(int id, [FromBody] CreateEditParaqitjaEProvimitDto dto)
        {

            var afatiAktiv = await _context.AfatiProvimit
   .FirstOrDefaultAsync(a => a.DepartamentiId == dto.DepartamentiId && a.Aktiv &&
                             a.DataFillimit <= DateTime.UtcNow && a.DataMbarimit >= DateTime.UtcNow);

            if (afatiAktiv == null)
                return BadRequest("Nuk ka afat të aktiv për editimin e këtij provimi.");
            var paraqitjaEProvimit = await _context.ParaqitjaEprovimit.FindAsync(id);
            if (paraqitjaEProvimit == null) return NotFound();
            _mapper.Map(dto, paraqitjaEProvimit);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Paraqitja e Provimit u përditësua me sukses" });

        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> DeleteParaqitjaEProvimit(int id)
        {
            var paraqitjaEProvimit = await _context.ParaqitjaEprovimit.FindAsync(id);
            if (paraqitjaEProvimit == null) return NotFound();
            var afati = await _context.AfatiProvimit
                .FirstOrDefaultAsync(a => a.AfatiProvimitId == paraqitjaEProvimit.AfatiProvimitId);

            Console.WriteLine($"AfatiId: {paraqitjaEProvimit?.AfatiProvimitId}");
            Console.WriteLine($"Afati null? {afati == null}");
            Console.WriteLine($"Aktiv: {afati?.Aktiv}");
            Console.WriteLine($"DataMbarimit: {afati?.DataMbarimit}");
            Console.WriteLine($"DataNow: {DateTime.UtcNow}");

            if (!afati.Aktiv || afati.DataMbarimit < DateTime.UtcNow)
                return BadRequest("Ky afat është përfunduar ose jo aktiv. Nuk mund të anuloni paraqitjen.");


            var ekzistonNota = await _context.Nota.AnyAsync(n => n.ParaqitjaId == id);
            if (ekzistonNota)
                return BadRequest("Nuk mund të anulohet paraqitja sepse ekziston një notë për këtë provim. Së pari duhet të fshihet nota.");
            _context.ParaqitjaEprovimit.Remove(paraqitjaEProvimit);
            await _context.SaveChangesAsync();
            return Ok(new { message = $" Paraqitja e Provimitme ID= {id} u fshi me sukses" });
        }

        [HttpGet("ligjeruesit-per-lende/{lendaId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> MerrLigjeruesitPerLende(int lendaId)
        {
            var ligjeruesit = await _context.Ligjerata
                .Where(l => l.LendaId == lendaId)
                .Include(l => l.Stafi)
                .ThenInclude(s => s.Useri)
                .Select(l => new
                {
                    l.StafiId,
                    Emri = l.Stafi.Useri.Emri,
                    Mbiemri = l.Stafi.Useri.Mbiemri
                })
                .ToListAsync();

            return Ok(ligjeruesit);
        }

        [HttpGet("provimet-e-paraqitura/studenti/{studentiId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetParaqitjetEStudentit(int studentiId)
        {
            var paraqitjet = await _context.ParaqitjaEprovimit
            .Where(p => p.StudentiId == studentiId)
            .Include(p => p.Lenda)
            .Include(p => p.StafiAkademik)
            .ThenInclude(sa => sa.Useri)
            .ToListAsync();

            var dtoList = _mapper.Map<List<ProvimetEParaqituraDto>>(paraqitjet);
            return Ok(dtoList);

        }




    }

}