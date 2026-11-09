package com.materias.cadastro_materias.infrastructure.entitys;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "materia")
@Entity
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "nome", unique = true)
    private String nome;

    @Column(name = "professor", unique = true)
    private String professor;

    @Column(name = "nota_media")
    @JsonProperty("nota_media")
    private Double notaMedia;

    @Column(name = "aula_semana")
    @JsonProperty("aula_semana")
    private Integer aulaSemana;
}