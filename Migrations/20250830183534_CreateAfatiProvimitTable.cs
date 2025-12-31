using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smis.Migrations
{
    /// <inheritdoc />
    public partial class CreateAfatiProvimitTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AfatiProvimit",
                columns: table => new
                {
                    AfatiProvimitId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataFillimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataMbarimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DepartamentiId = table.Column<int>(type: "int", nullable: false),
                    Aktiv = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AfatiProvimit", x => x.AfatiProvimitId);
                    table.ForeignKey(
                        name: "FK_AfatiProvimit_Departamenti_DepartamentiId",
                        column: x => x.DepartamentiId,
                        principalTable: "Departamenti",
                        principalColumn: "DepartamentiID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AfatiProvimit_DepartamentiId",
                table: "AfatiProvimit",
                column: "DepartamentiId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AfatiProvimit");
        }
    }
}
