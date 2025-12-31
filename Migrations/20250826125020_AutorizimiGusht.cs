using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smis.Migrations
{
    /// <inheritdoc />
    public partial class AutorizimiGusht : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Roli",
                table: "StafiAkademik",
                newName: "RoliStafit");

            migrationBuilder.AddColumn<bool>(
                name: "Aktiv",
                table: "Grupi",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Kapaciteti",
                table: "Grupi",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aktiv",
                table: "Grupi");

            migrationBuilder.DropColumn(
                name: "Kapaciteti",
                table: "Grupi");

            migrationBuilder.RenameColumn(
                name: "RoliStafit",
                table: "StafiAkademik",
                newName: "Roli");
        }
    }
}
