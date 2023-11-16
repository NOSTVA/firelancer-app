import { FastifyReply, FastifyRequest } from "fastify";
import {
  acceptTeamInvitation,
  createTeamInvitation,
} from "@/modules/teams/invitations/invitations.services";
import { CreateInvitationBody } from "@/modules/teams/invitations/invitations.schemas";

export async function createTeamInvitationHandler(
  request: FastifyRequest<{
    Params: { teamId: string };
    Body: CreateInvitationBody;
  }>,
  reply: FastifyReply
) {
  try {
    const invitation = await createTeamInvitation({
      userId: request.body.userId,
      teamId: request.params.teamId,
    });
    return reply.code(201).send({ token: invitation.id });
  } catch (e: any) {
    if (e.code === "23503") {
      reply.code(400);
      throw Error("Invalid user information");
    }
    throw e;
  }
}

export async function acceptTeamInvitationHandler(
  request: FastifyRequest<{
    Params: { invitationId: string };
  }>,
  reply: FastifyReply
) {
  try {
    const result = await acceptTeamInvitation({
      invitationId: request.params.invitationId,
      userId: request.user.id,
    });

    if (!result) {
      reply.code(400);
      throw Error("Invalid team invitation");
    }

    return reply.code(200).send(result);
  } catch (e: any) {
    if (e.code === "23505") {
      reply.code(400);
      throw Error("You are already a member of this team");
    }
    throw e;
  }
}
