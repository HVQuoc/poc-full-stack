package org.dacnpm.rento.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;


@Entity
@Data
@NoArgsConstructor
@Table(name = "accommodations")
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String short_description;
    private String description;
    private String address;
    private String cover_img_src;
    private int price;
    private int num_of_bedroom;
    private int num_of_bed;
    private int max_guests;

    @Column(columnDefinition = "geometry(Point, 4326)")
    @JsonIgnore
    private Point location;

    @JsonProperty("latitude")
    public double getLatitude() {
        return location != null ? location.getY() : 0.0;
    }

    @JsonProperty("longitude")
    public double getLongitude() {
        return location != null ? location.getX() : 0.0;
    }
}
