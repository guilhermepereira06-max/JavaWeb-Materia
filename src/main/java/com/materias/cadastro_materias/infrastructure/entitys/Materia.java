package com.materias.cadastro_materias.infrastructure.entitys;

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

    @Column(name = "nome",unique = true)
    private String nome;

    @Column(name = "professor")
    private String professor;

    @Column(name = "nota_media")
    private String nota_media;
}
