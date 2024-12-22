class MembershipService {
    constructor(db) {
        this.client = db.sequelize;
        this.Membership = db.Membership;
    }

    async createMembership(name, fromTotalPurchases, toTotalPurchases, discount) {
        return this.Membership.create({
            Name: name,
            FromTotalPurchases: fromTotalPurchases,
            ToTotalPurchases: toTotalPurchases,
            Discount: discount,
        });
    }

    async getAllMemberships() {
        return this.Membership.findAll();
    }

    async updateMembership(membershipId, name) {
        const membership = await this.Membership.findOne({ where: { Id: membershipId } });
        if (!membership) {
            return null;
        }
        return membership.update({ Name: name });
    }

    async deleteMembership(membershipId) {
        return this.Membership.destroy({
            where: { Id: membershipId },
        });
    }
}

module.exports = MembershipService;