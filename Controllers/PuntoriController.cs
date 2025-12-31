using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smis.Dtos.Departamenti;
using Smis.Mappers.DepartamentiMappers;
using Smis.Models;
using Microsoft.AspNetCore.Authorization;
using System.Xml.Serialization;
using Smis.Dtos.PuntoriDto;
using AutoMapper;

namespace Smis.Controllers
{
    // [Authorize]
    [Route("api/roboti")]
    [ApiController]

    public class PuntoriController : ControllerBase
    {
        private readonly SmisContext _context;
        private readonly IMapper _imapper;

        public PuntoriController(SmisContext context, IMapper imapper)
        {
            _context = context;
            _imapper = imapper;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Roboti>>> GetPuntori()
        {
            var robotet = await _context.Roboti
                .ToListAsync();

            if (robotet == null)
            {
                return NotFound();
            }

            return Ok(robotet);
        }

        [HttpPost]

        public async Task<IActionResult> CreatePuntori([FromBody] CreateRobotiDto dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var puntori = _imapper.Map<Roboti>(dto);
            _context.Roboti.Add(puntori);
            await _context.SaveChangesAsync();

            return Ok(puntori);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdatePuntori(int id, [FromBody] CreateRobotiDto dto)
        {
            var existingRoboti = await _context.Roboti.FindAsync(id);
            if (existingRoboti == null) return NotFound();

            existingRoboti.Emri = dto.Emri;
            existingRoboti.Modeli = dto.Modeli;
            existingRoboti.VitiProdhimit = dto.VitiProdhimit;
            existingRoboti.FabrikaId = dto.FabrikaId;


            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuntori(int id)
        {
            var roboti = await _context.Roboti.FindAsync(id);
            if (roboti == null) return NotFound();

            _context.Roboti.Remove(roboti);
            await _context.SaveChangesAsync();
            return Ok();
        }











    }
}