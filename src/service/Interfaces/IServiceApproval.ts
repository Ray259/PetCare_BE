export interface IServiceApproval {
  approveService(id: string);
  rejectService(id: string);
  completeService(id: string);
}
