import { type NodeExecutionContext } from "@gravityai-dev/plugin-base";
import { CloudinaryFileContentConfig, CloudinaryFileContentOutput } from "../util/types";
import { getCloudinaryFileContent } from "../service/getFileContent";
import { PromiseNode, createLogger } from "../../shared/platform";
import { NODE_TYPE } from "./index";

export class CloudinaryFileContentExecutor extends PromiseNode<CloudinaryFileContentConfig> {
  constructor() {
    super(NODE_TYPE);
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: CloudinaryFileContentConfig,
    context: NodeExecutionContext
  ): Promise<CloudinaryFileContentOutput> {
    const logger = createLogger("CloudinaryFileContent");
    
    // Build credential context for service
    const credentialContext = this.buildCredentialContext(context);
    
    try {
      const result = await getCloudinaryFileContent(
        config,
        credentialContext.credentials?.cloudinaryCredential,
        logger
      );

      logger.info("CloudinaryFileContent execution completed", {
        publicId: config.file?.public_id,
        format: result.format,
        hasTransformation: !!result.transformation
      });

      return {
        __outputs: {
          fileContent: result
        }
      };
    } catch (error: any) {
      logger.error("CloudinaryFileContent execution failed", {
        error: error.message,
        code: error.code,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Build credential context from execution context
   */
  private buildCredentialContext(context: NodeExecutionContext) {
    return {
      credentials: {
        cloudinaryCredential: context.credentials?.cloudinaryCredential || {},
      },
      nodeType: NODE_TYPE,
      workflowId: context.workflow?.id || "",
      executionId: context.executionId || "",
      nodeId: context.nodeId || "",
    };
  }
}
