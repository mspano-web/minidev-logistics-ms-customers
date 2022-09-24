import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GeometryTransformer } from '../utils/tranform-geoposition';
import { Geometry } from 'geojson';

/* ----------------------------------- */

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326, // WGS84 reference system
    transformer: new GeometryTransformer(),
  })
  location?: Geometry;
  
  @Column()
  zone_id: number;

  @Column()
  role_id: number;
}

/* ----------------------------------- */


