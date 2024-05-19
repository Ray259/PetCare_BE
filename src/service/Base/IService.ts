export interface IService {
  create(dto: any);
  findAll(dto: any);
  findById(id: string);
  findAllByPet(id: string);
  update(id: string, dto: any);
  remove(id: string);
}
