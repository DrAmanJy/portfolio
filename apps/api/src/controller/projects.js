import Projects from "../models/projects.js";
import AppError from "../utils/AppError.js";
import { fetchRecentCommits } from "../utils/github.js";
import { createUniqueSlug } from "../utils/slug.js";

export const createProject = async (req, res) => {
  const slug = await createUniqueSlug(req.body.name);
  const lastDeployed = new Date();

  let recentUpdates = [];
  try {
    recentUpdates = await fetchRecentCommits(req.body.repoUrl);
  } catch (err) {
    console.error("GitHub fetch failed:", err.message);
  }

  const project = await Projects.create({
    ...req.body,
    slug,
    lastDeployed,
    recentUpdates,
  });

  res.status(201).json({
    status: "success",
    message: "Project created successfully",
    project,
  });
};

export const getProject = async (req, res) => {
  const projectId = req.params.projectId;

  const project = await Projects.findById(projectId);

  if (!project) throw new AppError(404, "Project not found");

  const REFETCH_INTERVAL = 2 * 24 * 60 * 60 * 1000;

  const shouldRefetch =
    !project.recentUpdates?.length ||
    Date.now() - new Date(project.recentUpdates[0].createdAt).getTime() >
      REFETCH_INTERVAL;

  if (shouldRefetch) {
    try {
      const latestCommits = await fetchRecentCommits(project.repoUrl);

      await Projects.findByIdAndUpdate(projectId, {
        recentUpdates: latestCommits,
      });

      project.recentUpdates = latestCommits;
    } catch (err) {
      console.error("Failed to refresh commits:", err.message);
    }
  }

  res.status(200).json({
    status: "success",
    message: "Project fetched successfully",
    project,
  });
};

export const getProjects = async (req, res) => {
  const projects = await Projects.find().limit(10);

  const REFETCH_INTERVAL = 2 * 24 * 60 * 60 * 1000;

  await Promise.all(
    projects.map(async (project) => {
      const shouldRefetch =
        !project.recentUpdates?.length ||
        Date.now() - new Date(project.recentUpdates[0].createdAt).getTime() >
          REFETCH_INTERVAL;

      if (!shouldRefetch) return;

      try {
        const latestCommits = await fetchRecentCommits(project.repoUrl);

        await Projects.findByIdAndUpdate(project._id, {
          recentUpdates: latestCommits,
        });

        project.recentUpdates = latestCommits;
      } catch (err) {
        console.error("Failed to refresh commits:", err.message);
      }
    }),
  );

  res.status(200).json({
    status: "success",
    message: "Projects fetched successfully",
    projects,
  });
};
