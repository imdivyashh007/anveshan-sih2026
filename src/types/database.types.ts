export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'citizen' | 'researcher' | 'evaluator' | 'admin';
          created_at: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          district: string;
          block_or_village: string | null;
          image_url: string | null;
          status: 'Reported' | 'Under Review' | 'Adopted' | 'Resolved';
          upvotes: number;
          created_at: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          challenge_id: string;
          researcher_id: string;
          title: string;
          abstract: string;
          budget_inr: number;
          timeline_months: number;
          status: 'Pending' | 'Approved' | 'Rejected';
          created_at: string;
        };
      };
      milestones: {
        Row: {
          id: string;
          proposal_id: string;
          title: string;
          description: string;
          due_date: string;
          status: 'Pending' | 'Submitted' | 'Verified';
        };
      };
    };
  };
}