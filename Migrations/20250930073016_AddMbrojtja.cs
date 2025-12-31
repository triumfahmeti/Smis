using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smis.Migrations
{
    /// <inheritdoc />
    public partial class AddMbrojtja : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ParaqitjaEProvimit_AfatiProvimit_AfatiId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.DropIndex(
                name: "IX_ParaqitjaEProvimit_AfatiId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.DropColumn(
                name: "AfatiId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.AddColumn<int>(
                name: "AfatiProvimitId",
                table: "ParaqitjaEProvimit",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Fabrika",
                columns: table => new
                {
                    FabrikaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmriFabrikes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lokacioni = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fabrika", x => x.FabrikaId);
                });

            migrationBuilder.CreateTable(
                name: "Puntori",
                columns: table => new
                {
                    PuntoriId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mbiemri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pozita = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FabrikaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Puntori", x => x.PuntoriId);
                    table.ForeignKey(
                        name: "FK_Puntori_Fabrika_FabrikaId",
                        column: x => x.FabrikaId,
                        principalTable: "Fabrika",
                        principalColumn: "FabrikaId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ParaqitjaEProvimit_AfatiProvimitId",
                table: "ParaqitjaEProvimit",
                column: "AfatiProvimitId");

            migrationBuilder.CreateIndex(
                name: "IX_Puntori_FabrikaId",
                table: "Puntori",
                column: "FabrikaId");

            migrationBuilder.AddForeignKey(
                name: "FK_ParaqitjaEProvimit_AfatiProvimit_AfatiProvimitId",
                table: "ParaqitjaEProvimit",
                column: "AfatiProvimitId",
                principalTable: "AfatiProvimit",
                principalColumn: "AfatiProvimitId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ParaqitjaEProvimit_AfatiProvimit_AfatiProvimitId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.DropTable(
                name: "Puntori");

            migrationBuilder.DropTable(
                name: "Fabrika");

            migrationBuilder.DropIndex(
                name: "IX_ParaqitjaEProvimit_AfatiProvimitId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.DropColumn(
                name: "AfatiProvimitId",
                table: "ParaqitjaEProvimit");

            migrationBuilder.AddColumn<int>(
                name: "AfatiId",
                table: "ParaqitjaEProvimit",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ParaqitjaEProvimit_AfatiId",
                table: "ParaqitjaEProvimit",
                column: "AfatiId");

            migrationBuilder.AddForeignKey(
                name: "FK_ParaqitjaEProvimit_AfatiProvimit_AfatiId",
                table: "ParaqitjaEProvimit",
                column: "AfatiId",
                principalTable: "AfatiProvimit",
                principalColumn: "AfatiProvimitId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
