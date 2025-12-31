using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smis.Dtos.Departamenti;
using Smis.Mappers.DepartamentiMappers;
using Smis.Models;
using Microsoft.AspNetCore.Authorization;
using System.Xml.Serialization;
using Smis.Dtos.FabrikaDto;
using AutoMapper;

namespace Smis.Controllers
{
    // [Authorize]
    [Route("api/fabrika")]
    [ApiController]

    public class FabrikaController : ControllerBase
    {
        private readonly SmisContext _context;
        private readonly IMapper _imapper;

        public FabrikaController(SmisContext context, IMapper imapper)
        {
            _context = context;
            _imapper = imapper;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fabrika>>> GetFabrika()
        {
            var fabrikat = await _context.Fabrika
                .ToListAsync();

            if (fabrikat == null)
            {
                return NotFound();
            }

            return Ok(fabrikat);
        }

        [HttpPost]

        public async Task<IActionResult> CreateFabrika([FromBody] CreateFabrikaDto dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var fabrika = _imapper.Map<Fabrika>(dto);
            _context.Fabrika.Add(fabrika);
            await _context.SaveChangesAsync();

            return Ok(fabrika);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateFabrika(int id, [FromBody] CreateFabrikaDto dto)
        {
            var existingFabrika = await _context.Fabrika.FindAsync(id);
            if (existingFabrika == null) return NotFound();

            existingFabrika.Emri = dto.Emri;
            existingFabrika.Lokacioni = dto.Lokacioni;
            existingFabrika.Shteti = dto.Shteti;

            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFabrika(int id)
        {
            var fabrika = await _context.Fabrika.FindAsync(id);
            if (fabrika == null) return NotFound();

            _context.Fabrika.Remove(fabrika);
            await _context.SaveChangesAsync();
            return Ok();
        }











    }
}