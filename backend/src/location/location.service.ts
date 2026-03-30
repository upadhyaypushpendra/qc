import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

export interface UpdateLocationDto {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
}

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
  ) {}

  /**
   * Update or create delivery partner location
   */
  async updateLocation(
    userId: string,
    data: UpdateLocationDto,
  ): Promise<Location> {
    let location = await this.locationRepo.findOne({ where: { userId } });

    if (!location) {
      // Create new location
      location = this.locationRepo.create({
        userId,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        speed: data.speed,
        isTracking: true,
      });
    } else {
      // Update existing location
      location.latitude = data.latitude;
      location.longitude = data.longitude;
      location.accuracy = data.accuracy || 0;
      location.speed = data.speed || 0;
      location.updatedAt = new Date();
    }

    return this.locationRepo.save(location);
  }

  /**
   * Get user's current location
   */
  async getLocation(userId: string): Promise<Location> {
    const location = await this.locationRepo.findOne({ where: { userId } });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  /**
   * Start tracking for user
   */
  async startTracking(userId: string): Promise<void> {
    let location = await this.locationRepo.findOne({ where: { userId } });

    if (!location) {
      location = this.locationRepo.create({
        userId,
        latitude: 0,
        longitude: 0,
        isTracking: true,
      });
    } else {
      location.isTracking = true;
    }

    await this.locationRepo.save(location);
  }

  /**
   * Stop tracking for user
   */
  async stopTracking(userId: string): Promise<void> {
    const location = await this.locationRepo.findOne({ where: { userId } });

    if (location) {
      location.isTracking = false;
      await this.locationRepo.save(location);
    }
  }

  /**
   * Get all active locations (for delivery partners currently tracking)
   */
  async getAllActiveLocations(): Promise<Location[]> {
    return this.locationRepo.find({
      where: { isTracking: true },
    });
  }
}
