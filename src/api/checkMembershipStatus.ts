export enum MembershipStatus {
    ACTIVE,
    INACTIVE,
}

type Response = {
    values: { id: number; status_id: number }[];
    entity: string;
    action: string;
    debug: any;
    version: number;
    count: number;
    countFetched: number;
};

export const checkMembershipStatus = async (email: string) => {
    if (process.env.API_OVERRIDE && parseInt(process.env.API_OVERRIDE)) {
        return MembershipStatus.ACTIVE;
    }

    const data = {
        select: ["status_id"],
        join: [
            ["Email AS email", "LEFT", ["email.contact_id", "=", "contact_id"]],
        ],
        where: [
            ["email.email", "=", email],
            ["membership_type_id", "IN", [1, 5, 6, 2]],
            ["status_id", "IN", [1, 2, 3]],
        ],
        limit: 25,
    };

    const response = await fetch(
        `https://lyme.thiersupport.eu/civicrm/ajax/api4/Membership/get`,
        {
            method: "POST",
            body: new URLSearchParams({
                params: JSON.stringify(data),
            }).toString(),
            headers: {
                "X-Civi-Auth": `Bearer ${process.env.MEMBERSHIP_API_SECRET}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    if (response.status !== 200) {
        throw new Error(`Invalid response code: ${response.status}`);
    }

    const json: Response = await response.json();

    return json.count > 0 ? MembershipStatus.ACTIVE : MembershipStatus.INACTIVE;
};
