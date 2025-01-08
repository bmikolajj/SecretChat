export class UserController {
    constructor(private userService: any) {}

    async getUserProfile(req: any, res: any) {
        try {
            const userId = req.params.id;
            const userProfile = await this.userService.getUserProfile(userId);
            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(userProfile);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async updateUserProfile(req: any, res: any) {
        try {
            const userId = req.params.id;
            const updatedData = req.body;
            const updatedUser = await this.userService.updateUserProfile(userId, updatedData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}