const companyService = require('../Services/companyService.js');
const create = async (req, res) => {
	const companyData = req.body;
		
	await companyService.create(companyData, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(201).send(result);
	});
};
const login = async (req, res) => {
	const {email} = req.body;
	await userCompany.login(email, (err, result) => {
		  console.log("result.....",result);
	   result.token = auth.generateToken(result.id.toString(), result.email);
	  return res
		.status(200)
		.send({ message: "User login successful!", user: result });
	});
  };
const getCompanies= async (req, res) => {
    console.log(req.user);
	const userId = req.user.id;
	await workspaceService.getWorkspaces(userId, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};
const getCompany = async (req, res) => {
	console.log("Company")
	const { companyId } = req.params;
	// Validate whether params.id is in the user's boards or not
	const validate = req.user.workspaces.filter((workspace) => workspace === workspaceId);
	// Call the service
	await workspaceService.getWorkspace(workspaceId, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};
const updateCompany = async (req, res) => {
	// Validate whether params.id is in the user's boards or not
	const validate = req.user.workspaces.filter((Wspace) => Wspace === req.params.id);
	if (!validate)
		return res
			.status(400)
			.send({ errMessage: 'You can not change background of this board, you are not a member or owner!' });
	const { workspaceId } = req.params;
	const { name } = req.body;
	// Call the service
	await workspaceService.updateWorkspaceName(workspaceId, name,req.user, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};
module.exports = {
	create,
	getCompanies,
    getCompany,
	updateCompany,
	login
	
};
